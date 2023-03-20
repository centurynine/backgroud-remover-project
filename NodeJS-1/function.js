module.exports = {
    searchJson: async function () {
        console.log("searchJson");
        var jsonData = await JSON.parse(fs.readFileSync('./NodeJS-1/data.json'));
        for (let i=0;i < jsonData.length; i++) {}
    }
  };