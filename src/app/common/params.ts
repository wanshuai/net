export interface Slot {
    item: number,
    name: string,
    minutes: number
  }

export interface Magic {
  minutes?: number,
  next?: string,
  slot?: Slot[]
}

export interface Minutes {
  total: number,
  new?: number,
}

export interface Res {
    status: number,
    msg: string,
    data?: Magic|Slot|Minutes|{}
  }

  export interface Dialog {
    name: string,
    key?: number,
  }