import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class RevalidateService {
  private readonly logger = new Logger(RevalidateService.name)
  private readonly webUrl = process.env.WEB_URL
  private readonly secret = process.env.REVALIDATE_SECRET

  async revalidate(path?: string, tag?: string) {
    if (!this.webUrl || !this.secret) return

    try {
      await fetch(`${this.webUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidate-secret': this.secret,
        },
        body: JSON.stringify({ path, tag }),
      })
      this.logger.log(`Revalidated: path=${path} tag=${tag}`)
    } catch (error) {
      this.logger.error('Failed to revalidate', error)
    }
  }
}