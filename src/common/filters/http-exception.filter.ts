import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  Injectable,
} from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    const status = exception.getStatus();
    const response = exception.getResponse();
    const code = this.mapHttpToGraphQLCode(status);

    const message =
      typeof response === 'object'
        ? response['message'] || exception.message
        : exception.message;

    this.logger.error({
      statusCode: status,
      message: 'GraphQL Error',
      error: message,
      operation: `${info.parentType}.${info.fieldName}`,
    });

    return new GraphQLError(message, {
      extensions: {
        code,
        http: { status },
        ...(typeof response === 'object' && {
          details: {
            ...response,
            timestamp: new Date().toISOString(),
          },
        }),
      },
    });
  }

  private mapHttpToGraphQLCode(status: number): string {
    const statusMap = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHENTICATED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_SERVER_ERROR',
    };

    return statusMap[status] || `HTTP_${status}`;
  }
}
