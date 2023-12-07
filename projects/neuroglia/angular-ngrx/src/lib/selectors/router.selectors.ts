import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectRouter = createFeatureSelector<RouterReducerState>('router');

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = getRouterSelectors(selectRouter);

export const selectRouteNestedParams = createSelector(selectRouter, (router) => {
  let currentRoute = router?.state?.root;
  let params: Params = {};
  while (currentRoute?.firstChild) {
    currentRoute = currentRoute.firstChild;
    params = {
      ...params,
      ...currentRoute.params,
    };
  }
  return params;
});

export const selectRouteNestedParam = (param: string) =>
  createSelector(selectRouteNestedParams, (params) => params && params[param]);

const getAllParams = (route: ActivatedRouteSnapshot): any =>
  route.children.reduce((acc, child) => {
    return { ...acc, ...child.params };
  }, {});

export const selectRouteDeepParams = createSelector(selectRouter, (router) => {
  let currentRoute = router?.state?.root;
  let params: Params = {};
  while (currentRoute?.firstChild) {
    params = {
      ...params,
      ...getAllParams(currentRoute),
    };
    currentRoute = currentRoute.firstChild;
  }
  return params;
});

export const selectRouteDeepParam = (param: string) =>
  createSelector(selectRouteDeepParams, (params) => params && params[param]);
