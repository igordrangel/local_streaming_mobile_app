import { BehaviorSubject } from 'rxjs';
import { PosterInterface } from './poster.interface';
import { VideoCategoriaEnum } from '../enums/video-categoria.enum';
import { VideoTipoEnum } from '../enums/video-tipo.enum';

export interface VideoInterface {
	id: number;
	tituloOriginal: string;
	titulo?: string;
	categoria: VideoCategoriaEnum;
	tipo: VideoTipoEnum;
	arquivo: string;
	poster: BehaviorSubject<PosterInterface>;
}
