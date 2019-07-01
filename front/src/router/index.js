import asyncComponent from "@/components/AsyncComponent";

const routes = [
    {
        path: "/post",
        meta: {
            title: "博客管理",
            position: "sidebar",
            icon: "fa-book",
            highlight: "/post"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/post/index`))
    },
    {
        path: "/post-form",
        meta: {
            title: "博客管理",
            highlight: "/post"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/post/form`))
    },
    {
        path: "/tag",
        meta: {
            title: "标签管理",
            position: "sidebar",
            icon: "fa-tags",
            highlight: "/tag"
        },
        layout: "manage",
        component: asyncComponent(() => import(`@/pages/tag/index`))
    },
    {
        layout: "fullpage",
        key: 404,
        meta: {
            title: "404"
        },
        component: asyncComponent(() => import(`@/pages/noMatch`))
    }
];

export default routes;
