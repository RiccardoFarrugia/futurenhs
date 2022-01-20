import { BreadCrumbList } from '@appTypes/routing';

export interface Props {
    shouldRenderSearch?: boolean;
    shouldRenderUserNavigation?: boolean;
    shouldRenderPhaseBanner?: boolean;
    shouldRenderBreadCrumb?: boolean; 
    shouldRenderMainNav?: boolean;
    user?: any;
    breadCrumbList?: BreadCrumbList;
    searchTerm?: any;
    className?: string; 
    children: any;
}
