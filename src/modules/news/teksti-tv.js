
const showNews = async(report) => {
    const pnumber = report.teletext.page.number;
    const name = report.teletext.page.name;
    const time = report.teletext.page.time;
    const loop = report.teletext.page.subpage[0].content[0].line;
    document.querySelector('#subpage').innerHTML = ('');

    for (let i=0; i < 11;i++) {

      for(i = 7; i < 13; i++){
        document.querySelector('#num').innerHTML = ('<li>' + (pnumber) + ' ' + (name) + '</li>');
        /* document.querySelector('#name').innerHTML = ('<li>' + (name) + '</li>');*/
        document.querySelector('#time').innerHTML = ('<li>' + (time) + '</li>');
        if (loop[i].Text != null)
            document.querySelector('#subpage').innerHTML += ('<li>' + (loop[i].Text) + '</li>');
        }
        document.querySelector('#subpage').innerHTML += ('<li>' + (loop[22].Text) + '</li>');
    }

};

const getJsonNews = async(menuUrl) => {
    let response;
    try {
        response = await fetch(`${menuUrl}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.log('Fetch error', error.message);
    }
    let news = await response.json();
    console.log(news);
    return news;
};

const getNews = async() => {
    const response = await getJsonNews('https://external.api.yle.fi/v1/teletext/pages/102.json?app_id=072f825b&app_key=921f3b699a881eab808884e74f4be799');
    const news = await response;
    /* timeNews(news); */
    showNews(news);
};

export { getNews };