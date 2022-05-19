import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { pool } from '../app.gateway';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';


async function userPost(data) {
  await console.log({ data: data });
  const datafrombd = await pool.query(
    `select *
     from setorupdateuser('${data.googleUserId}',
                          '${data.name}',
                          '${data.email}',
                          '${new Date().getTime()}',
                          '${data.imgUrl}')`,
  );

  return datafrombd.rows[0][Object.keys(datafrombd.rows[0])];
}

@Controller('get')
export class GetController {
  @Post()
  create(@Req() req, @Res() res) {
    const promise = new Promise(function (resolve) {
      req.on('data', async (chunk) => {
        const userData = await chunk.toString();
        resolve(JSON.parse(userData));
      });
    });
    promise.then(async function (userData) {
      const r = await userPost(userData);
      await res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      });
      await res.end(r);
    });
  }
}

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}