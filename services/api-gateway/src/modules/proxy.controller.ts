import { Body, Controller, Get, Headers, Param, Post, Put, Delete, Req } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

@Controller()
export class ProxyController {
  private AUTH = process.env.AUTH_SERVICE_URL || 'http://auth-service:3000';
  private CRM = process.env.CRM_SERVICE_URL || 'http://crm-service:3000';
  private SEARCH = process.env.SEARCH_SERVICE_URL || 'http://search-service:3000';
  private SECRET = process.env.JWT_SECRET || 'dev-secret';

  @Post('auth/login')
  login(@Body() body: any) { return axios.post(`${this.AUTH}/api/auth/login`, body).then(r => r.data); }

  @Post('auth/register')
  register(@Body() body: any) { return axios.post(`${this.AUTH}/api/auth/register`, body).then(r => r.data); }

  private verify(authorization?: string) {
    if (!authorization) throw new Error('Unauthorized');
    const token = authorization.replace('Bearer ', '');
    return jwt.verify(token, this.SECRET);
  }

  @Get('crm/contacts')
  listContacts(@Headers('authorization') auth?: string) { this.verify(auth); return axios.get(`${this.CRM}/api/crm/contacts`).then(r => r.data); }

  @Post('crm/contacts')
  createContact(@Headers('authorization') auth: string, @Body() body: any) { this.verify(auth); return axios.post(`${this.CRM}/api/crm/contacts`, body).then(r => r.data); }

  @Put('crm/contacts/:id')
  updateContact(@Headers('authorization') auth: string, @Param('id') id: string, @Body() body: any) { this.verify(auth); return axios.put(`${this.CRM}/api/crm/contacts/${id}`, body).then(r => r.data); }

  @Delete('crm/contacts/:id')
  deleteContact(@Headers('authorization') auth: string, @Param('id') id: string) { this.verify(auth); return axios.delete(`${this.CRM}/api/crm/contacts/${id}`).then(r => r.data); }

  @Get('search/contacts')
  searchContacts(@Headers('authorization') auth: string, @Req() req: any) { this.verify(auth); const q = req.query.q || '*'; return axios.get(`${this.SEARCH}/api/search/contacts`, { params: { q } }).then(r => r.data); }
}
