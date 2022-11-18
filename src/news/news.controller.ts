import { CacheInterceptor, CacheKey, CacheTTL, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private readonly service: NewsService) {}

    @Get('/:n/:keyword')
    async getNews(
        @Param('n') n: number,
        @Param('keyword') keyword: string
    ): Promise<any> {
        try {
            return await this.service.getNews(n, keyword);
        } catch (error) {
            throw new Error(error)
        }
    }

    @Get('/top/:n/:category')
    async getTopNews(
        @Param('n') n: number,
        @Param('category') category: string
    ): Promise<any> {
        try {
            return await this.service.getTopNews(n, category);
        } catch (error) {
            throw new Error(error)
        }
    }
}
