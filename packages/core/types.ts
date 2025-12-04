
export type LoaderFunction = (path: string) => Promise<CustomElementConstructor>;

export interface ILoader {
  postfix: string;
  loader: LoaderFunction;
}

export interface IConfig {
  scanImportmap: boolean;
  loaders: Record<string, ILoader | string>;
  observable: boolean;
}

export interface IImportMap { 
  imports: Record<string, string>
};

export interface IPrefixMap {
  [key: string]: string;
}
