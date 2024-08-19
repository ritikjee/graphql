export const blogQuery = `
    blogs(page:Int,pageSize:Int): [Blog!]
    blog(id: Int): Blog
`;
