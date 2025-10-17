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

const isProd = process.env.NODE_ENV === "production"

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

    const mapped = this.map(exception)

    const body: Record<string, any> = {
      statusCode: mapped.status,
      error: HttpStatus[mapped.status],
      message: mapped.message,
    }
    if (!isProd && mapped.details) body.details = mapped.details

    if (mapped.status >= 500) {
      this.logger.error(mapped.logMessage ?? mapped.message, (exception as any).stack)
    } else {
      this.logger.warn(mapped.logMessage ?? mapped.message)
    }

    httpAdapter.reply(ctx.getResponse(), body, mapped.status)
  }

  private map(e: AnyPrismaErr): {
    status: number
    message: string
    details?: any
    logMessage?: string
  } {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case "P2002": // Unique constraint failed
          return {
            status: HttpStatus.CONFLICT,
            message: "요청이 충돌했습니다.",
            details: { code: e.code, target: (e.meta as any)?.target },
            logMessage: `[P2002] Unique constraint failed: ${e.message}`,
          }
        case "P2025": // Record not found
          return {
            status: HttpStatus.NOT_FOUND,
            message: "요청한 리소스를 찾을 수 없습니다.",
            details: { code: e.code },
            logMessage: `[P2025] Record not found: ${e.message}`,
          }
        case "P2003": // FK constraint failed
          return {
            status: HttpStatus.CONFLICT,
            message: "요청이 제약 조건과 충돌했습니다.",
            details: { code: e.code },
            logMessage: `[P2003] FK constraint failed: ${e.message}`,
          }
        case "P2000": // Value too long for column
          return {
            status: HttpStatus.BAD_REQUEST,
            message: "요청 값이 유효하지 않습니다.",
            details: { code: e.code },
            logMessage: `[P2000] Value too long: ${e.message}`,
          }
        case "P2014": // Invalid relation
          return {
            status: HttpStatus.BAD_REQUEST,
            message: "요청이 유효하지 않습니다.",
            details: { code: e.code },
            logMessage: `[P2014] Invalid relation: ${e.message}`,
          }
        default:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: "요청이 유효하지 않습니다.",
            details: { code: e.code },
            logMessage: `[${e.code}] Prisma request error: ${e.message}`,
          }
      }
    }

    if (e instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "요청이 유효하지 않습니다.",
        details: { type: "ValidationError" },
        logMessage: `[Validation] ${e.message}`,
      }
    }

    if (e instanceof Prisma.PrismaClientInitializationError) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        message: "일시적으로 서비스를 이용할 수 없습니다.",
        details: { type: "InitializationError" },
        logMessage: `[Initialization] ${e.message}`,
      }
    }

    if (e instanceof Prisma.PrismaClientRustPanicError) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "서버 내부 오류가 발생했습니다.",
        details: { type: "RustPanic" },
        logMessage: `[RustPanic] ${e.message}`,
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "서버 내부 오류가 발생했습니다.",
      details: { type: "UnknownError" },
      logMessage: `[Unknown] ${(e as any)?.message ?? "Unknown error"}`,
    }
  }
}
