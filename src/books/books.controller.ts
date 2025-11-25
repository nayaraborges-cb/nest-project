import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { StorageService } from 'src/storage/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly storageService: StorageService,
  ) {}

 @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.booksService.findAll(page, limit);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(Number(id))
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.booksService.remove(+id);
  }

  @Post(':id/cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo de capa fornecido.');
    }

    const fileKey = `cover/${Date.now()}-{file.originalname}`;

    await this.storageService.uploadFile(file, 'covers', fileKey);

    const book = await this.booksService.updateCoverKey(id, fileKey);

    return {
      message: 'Capa atualizada com sucesso!',
      coverKey: book.coverKey,
    };
  }
}
