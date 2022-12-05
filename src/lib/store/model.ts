export const LAST_POSITION = -1;
export const FIRST_POSITION = 0;

export interface FragmentResp {
  results: [{
    uid: string,
    fragment: string,
    versions: {
      uid: string,
      version_date: string
    }[]
  }]
}

export interface VersionResp {
  results: [{
    uid: string,
    blocks: {
      uid: string,
      type: string
      value: string
      before: string
    }[]
  }]
}

export interface DragPoint {
  groupID: string,
  index: number
}

export interface DragState {
  active: boolean,
  start: DragPoint,
  moving: DragPoint
}


export interface ContentNodesGroup {
  fragmentId:string;
  fid: string;
  edited: boolean;
  blocks: string[]
}

export interface BlockNode {
  id: string;
  uid?: string;
  before?: string;
  edited: boolean;
  type: TextNodeType;
  value: string;
}

export interface ContentNode {
  uid?: string;
  before?: string;
  type: TextNodeType;
  value: string;
}

export interface VersionLite {
  uid: string,
  version_date: string,
}

export interface FragmentVersion {
  uid: string,
  nodes: string[];
}

export interface Fragment {
  uid: string;
  name: string;
  lastVersionId: string | undefined;
  versions: VersionLite[];
}



export enum TextNodeType {
  PARAGRAPH = 'PARAGRAPH',
  HEADER1 = 'HEADER1',
  HEADER2 = 'HEADER2',
  HEADER3 = 'HEADER3',
  IMAGE = 'IMAGE',
  CODE = 'CODE'
}
