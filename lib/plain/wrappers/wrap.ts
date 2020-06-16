/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosInstance } from 'axios'

export type DefaultParams = {
  spaceId?: string
  environmentId?: string
  organizationId?: string
}

export type WrapParams = {
  http: AxiosInstance
  defaults?: DefaultParams
}

type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>

type SetOptional<BaseType, Keys extends keyof BaseType = keyof BaseType> =
  // Pick just the keys that are not optional from the base type.
  Except<BaseType, Keys> &
    // Pick the keys that should be optional from the base type and make them optional.
    Partial<Pick<BaseType, Keys>>

type EndpointDefinition<T extends any[], P extends {}, R> = (
  http: AxiosInstance,
  params: P,
  ...rest: T
) => R

const withHttp = <T extends any[], P extends {}, R, A>(
  http: AxiosInstance,
  fn: EndpointDefinition<T, P, R>
) => {
  return (params: P, ...rest: T) => fn(http, params, ...rest)
}

const withDefaults = <T extends any[], P extends {}, R, D>(
  defaults: D | undefined,
  fn: (params: P, ...rest: T) => R
) => {
  return (params: SetOptional<P, keyof (P | D)>, ...rest: T) =>
    fn({ ...defaults, ...params } as P, ...rest)
}

export const wrap = <T extends any[], P extends {}, R>(
  { http, defaults }: WrapParams,
  fn: EndpointDefinition<T, P, R>
) => {
  return withDefaults(defaults, withHttp(http, fn))
}
