export interface IRoutes {
  [key: string]: Page;
}

export type Page = {
  [key: string]: string | number[];
};

export interface IRouter {
  locationHandler(): Promise<void>;
}
