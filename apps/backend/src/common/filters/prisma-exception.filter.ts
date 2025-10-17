// prisma-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"
import { Prisma } from "@prisma/client"

type AnyPrismaErr =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientValidationError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientRustPanicError

@Injectable()
@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name)

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: AnyPrismaErr, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost
    const ctx = host.switchToHttp()

    const { status, message, details } = this.map(exception)

    const body = {
      statusCode: status,
      error: HttpStatus[status],
      message,
      details,
    }

    if (status >= 500) this.logger.error(message, (exception as any).stack)
    else this.logger.warn(message)

    httpAdapter.reply(ctx.getResponse(), body, status)
  }

  private map(e: AnyPrismaErr): { status: number; message: string; details?: any } {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002": // Unique constraint failed
          return {
            status: HttpStatus.CONFLICT,
            message: "Unique constraint failed.",
            details: { target: (e.meta as any)?.target },
          }
        case "P2025": // Record not found
          return {
            status: HttpStatus.NOT_FOUND,
            message: "Record not found.",
            details: { cause: e.message },
          }
        case "P2003": // FK constraint failed
          return {
            status: HttpStatus.CONFLICT,
            message: "Foreign key constraint failed.",
            details: { field: (e.meta as any)?.field_name },
          }
        case "P2000": // Value too long for column
          return {
            status: HttpStatus.BAD_REQUEST,
            message: "Value too long for column.",
            details: { column: (e.meta as any)?.column_name },
          }
        case "P2014": // Invalid relation
          return {
            status: HttpStatus.BAD_REQUEST,
            message: "Invalid relation.",
            details: { cause: e.message },
          }
        default:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: "Prisma request error.",
            details: { code: e.code, cause: e.message },
          }
      }
    }

    if (e instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "Validation failed for Prisma query.",
        details: e.message,
      }
    }

    if (e instanceof Prisma.PrismaClientInitializationError) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: "Database is unavailable.",
        details: e.message,
      }
    }

    if (e instanceof Prisma.PrismaClientRustPanicError) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Prisma engine panic.",
        details: e.message,
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Unknown Prisma error.",
      details: (e as any)?.message,
    }
  }
}
