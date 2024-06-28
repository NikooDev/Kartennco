/*export interface SnapType {
  id: number
  type: 'text' | 'image'
  x: number
  y: number
  uri: string
  editable?: boolean
  resizable?: boolean
  content?: string
  src?: string
  width?: number
  height?: number
}*/

export interface SnapType {
  id: number
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  edit?: boolean;
  italic?: boolean;
  bold?: boolean;
  size?: number;
  family?: {
    roboto?: boolean
    indie?: boolean
    berlin?: boolean
    play?: boolean
    macondo?: boolean
  }
  width?: number;
  height?: number;
}

export type FontKey = keyof NonNullable<SnapType['family']>;

export interface GoodieType {
  uid: number
  name: string
  src: string
  title: string,
  note: number,
  price: number
}
