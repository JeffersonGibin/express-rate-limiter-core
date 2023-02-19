import { IResponseHit } from './cache'

export interface IDatabaseMemory {
  [key: string]: IResponseHit;
}
