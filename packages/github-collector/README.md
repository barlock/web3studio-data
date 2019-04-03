<h1 align="center">
  Web3Studio Data
  <br/>
</h1>

<h4 align="center">
 GitHub Collector
</h4>

<p align="center">
  <a href="#license">License</a>
</p>

Gathering github data and sending to AWS CloudWatch

<br/>

## Developing

Create a Github [personal access token](https://github.com/settings/tokens/new). You'll need at least `repo`, `admin:org`, and `user`

Create a `.env` file in the root of this package

```env
# .env
GITHUB_TOKEN=<YOUR_TOKEN>
```

To see the collector run locally, install deps start a local ELK service, and run the collector.

```bash
# Start Elk
$ docker-compose up

# In a different Terminal...
$ yarn install
$ yarn start
```

To see the data in Kibana, open your browser to [localhost:5601](/http://localhost:5601).

## License

[Apache 2.0](https://github.com/ConsenSys/web3studio-data/blob/master/LICENSE)
