const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());
const { JSDOM }=require('jsdom');
const axios=require('axios');
const { Readability }=require('@mozilla/readability');


async function getArticleContent(url) {
    console.log(url);
    const { data }=await axios.get(url)
    let dom=new JSDOM(data,{
        url: url
    });
    let article=new Readability(dom.window.document).parse();

    // return sr.toString();
    return article?.textContent

}

async function getArticles({
    query,page
}) {
    try {
        let url=`/everything?q=${query}&pageSize=8&page=${page}&apiKey=${process.env.NEWS_API_KEY}`
        const { data }=await axios.get(process.env.BASE_URL+url);

        return data

    } catch (error) {
        console.log(error);
    }

}

app.get('/content',async (req,res) => {
    try {

        const data=await getArticleContent(req.query.url);
        return res.status(200).json({ ...data });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }

})

app.get('/articles',async (req,res) => {
    try {
        console.log(req.query);
        const { query,page }=req.query;
        res.json({ data: await getArticles({ query,page }) });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}
)


const PORT=process.env.PORT||8000;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
}
)   