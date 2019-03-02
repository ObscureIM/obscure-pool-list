# obscure-pool-list
List of all mining pools for the Obscure - Network

This JSON will be pinged by the official pool.osidian.im API. If you would like your pool to appear in our main block explorer, please make a pull request and append your mining node to nodelist.json. Note that you will need to have your /stats/ api exposed. If you don't know how to do this, take a look at the node-obscure-pool and load index.html within the 'website' folder and look at the api calls that it is making.

```

[
  {
    "name":"Official Obscure Pool", //Name of your pool
    "url":"https://pool.obscure.im", //website of your pool
    "api":"https://pool.obscure.im/stats", //Expose your /stats api here, my secondary server will ping it
    "type":"forknote",
  }
]

```
