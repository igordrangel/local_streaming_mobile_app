import { koala } from 'koala-utils';
import { VideoCategoriaEnumTranslate } from './enums/translate/video-categoria.enum.translate';
import { VideoCategoriaEnum } from './enums/video-categoria.enum';
import { EnumTranslate } from './enums/enum.translate';

export const videoCategoriaOptions = koala([
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.acao),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.thriller),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.terror),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.suspense),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.fantasia),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.guerra),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.ficcaoCientifica),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.epico),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.documentario),
	VideoCategoriaEnumTranslate.translate(VideoCategoriaEnum.comedia)
]).array<EnumTranslate>().orderBy('name').getValue();
