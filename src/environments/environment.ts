// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  contractAddress:"0x8DD130Cd016d322555f96C10861ed4d79A916337",
  chainId: '0x13881',//mumbai
  rpcURL: 'https://matic-mumbai.chainstacklabs.com',
  networkName: 'Mumbai Testnet',
  currencyName: 'MATIC',
  currencySymbol: 'matic',
  explorerURL: 'https://mumbai-explorer.matic.today/',
  endpoint:'http://localhost:3000/sign',
  configUrl:'assets/prode-abi.json'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
