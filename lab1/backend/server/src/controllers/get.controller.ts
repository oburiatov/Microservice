import { Controller, Post, Req, Res } from '@nestjs/common';
import { pool } from '../app.gateway';


async function userPost(data) {
  await console.log({ data: data });
  const datafrombd = await pool.query(
    `select *
     from setorupdateuser('${data.googleUserId}',
                          '${data.name}',
                          '${data.email}',
                          '${new Date().getTime()}',
                          '${data.imgUrl}')`);

  return datafrombd.rows[0][Object.keys(datafrombd.rows[0])];
}


@Controller('get')
export class GetController {
  @Post()
  create(@Req() req, @Res() res) {
    const promise = new Promise(function(resolve) {
      req.on('data', async chunk => {
        let userData = await chunk.toString();
        resolve(JSON.parse(userData));
      });
    });
    promise.then(async function(userData) {
      let r = await userPost(userData);
      await res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
      await res.end(r);
    });
  }
}