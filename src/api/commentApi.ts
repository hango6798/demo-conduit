import axiosClient from "./axiosClient"

const commentApi = {
    getComments(slug: string): Promise<any>{
        const url = `/articles/${slug}/comments`
        return axiosClient.get(url)
    },
    createComment(slug: string, comment: string): Promise<any>{
        const url = `/articles/${slug}/comments`
        return axiosClient.post(url, {
            comment: {
                body: comment
            }
        })
    },
    deleteComment(slug:string, commentId: number): Promise<any>{
        const url = `/articles/${slug}/comments/${commentId}`
        return axiosClient.delete(url)
    }
}

export default commentApi