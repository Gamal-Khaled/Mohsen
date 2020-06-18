import FetchWrapper from "./src/service/FetchWrapper";

export default async (taskData: any) => {
    const fetchWrapper = new FetchWrapper('https://cs495-705cf.firebaseio.com');

    fetchWrapper.post("/SnowboyHeadlessTaskTest.json", { data: 'stort' });
};