import { BehaviorSubject } from 'rxjs';
import { PosterInterface } from './poster.interface';
import { VideoCategoriaEnum } from '../enums/video-categoria.enum';
import { VideoTipoEnum } from '../enums/video-tipo.enum';
import { VideoArquivoInterface } from './video-arquivo.interface';

export interface VideoInterface {
	id: number;
	tituloOriginal: string;
	titulo?: string;
	categoria: VideoCategoriaEnum;
	tipo: VideoTipoEnum;
	arquivos: VideoArquivoInterface[];
	poster: BehaviorSubject<PosterInterface>;
}
