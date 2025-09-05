import type {NavigateFunction, Params} from "react-router"

const history = {
  location: null as Location | null,
  navigate: null as NavigateFunction | null,
  params: null as Readonly<Params<string>> | null,
}

export default history
