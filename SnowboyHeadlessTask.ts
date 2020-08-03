import FetchWrapper from "./src/service/FetchWrapper";

export default async (taskData: any) => {
    console.log('Receiving from Snowboy!');
    const fetchWrapper = new FetchWrapper('https://cs495-705cf.firebaseio.com');

    fetchWrapper.post("/SnowboyHeadlessTaskTest.json", { data: 'stort' });
};