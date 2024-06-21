const express=require('express');
const cors=require('cors');
const app=express();
app.use(express.json());
const { convert }=require('html-to-text');
app.use(cors());
const { JSDOM }=require('jsdom');
const axios=require('axios');
const { Readability }=require('@mozilla/readability');


async function getArticleContent(url) {
    const { data }=await axios.get(url)
    let dom=new JSDOM(data,{
        url: url
    });
    let article=new Readability(dom.window.document).parse();

    // return sr.toString();
    return article?.textContent

}

app.get('/content',async (req,res) => {
    try {
        console.log(req.query.url);
        res.json({ data: await getArticleContent(req.query.url) });
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