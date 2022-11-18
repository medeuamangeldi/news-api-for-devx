import { HttpService } from '@nestjs/axios'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService } from "@nestjs/config";
import * as sha1 from 'sha1';

@Injectable()
export class NewsService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheService: Cache
    ) {}

    async getNews(N: number, keyword: string): Promise<any> {
        try {
            const hash: string = sha1(N.toString()+keyword+'news');

            const cachedData = await this.cacheService.get(hash);
            if (cachedData) {
                return cachedData;
            }

            const apikey = this.configService.get<string>('API_KEY');
            const url = `https://gnews.io/api/v4/search?q=${keyword}&token=${apikey}&lang=en&country=us&max=${N}`;
            const { data } = await this.httpService.axiosRef.get(url);
            await this.cacheService.set(hash, data);

            return data
        } catch (error) {
            throw new Error(error)
        }
    }

    async getTopNews(N: number, category: string): Promise<any> {
        try {
            const hash: string = sha1(N.toString()+category+'top');

            const cachedData = await this.cacheService.get(hash);
            if (cachedData) {
                return cachedData;
            }

            const apikey = this.configService.get<string>('API_KEY');;
            const url = `https://gnews.io/api/v4/top-headlines?topic=${category}&token=${apikey}&lang=en&country=us&max=${N}`;
            const { data } = await this.httpService.axiosRef.get(url);
            await this.cacheService.set(hash, data);
            
            return data
        } catch (error) {
            throw new Error(error)
        }
    }
}
