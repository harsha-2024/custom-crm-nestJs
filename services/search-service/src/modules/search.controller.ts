import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
@Controller('search')
export class SearchController {
  constructor(private svc: SearchService) {}
  @Get('contacts') search(@Query('q') q: string) { return this.svc.searchContacts(q || '*'); }
}
