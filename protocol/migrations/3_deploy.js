const Deployer1 = artifacts.require("Deployer1");
const Deployer2 = artifacts.require("Deployer2");
const Deployer3 = artifacts.require("Deployer3");
const Implementation = artifacts.require("Implementation");
const Root = artifacts.require("Root");

async function deployTestnet(deployer) {

    const d1 = await deployer.deploy(Deployer1);
    const root = await deployer.deploy(Root, d1.address);
    const rootAsD1 = await Deployer1.at(root.address);

    const d2 = await deployer.deploy(Deployer2);
    await rootAsD1.implement(d2.address);
    const rootAsD2 = await Deployer2.at(root.address);

    const d3 = await deployer.deploy(Deployer3);
    await rootAsD2.implement(d3.address);
    const rootAsD3 = await Deployer3.at(root.address);

    const implementation = await deployer.deploy(Implementation);
    await rootAsD3.implement(implementation.address);

    console.log('rootAsD1', rootAsD1.address);
    console.log('rootAsD2', rootAsD2.address);
    console.log('rootAsD3', rootAsD3.address);
    console.log('Root', Root.address);
    console.log('Implementation', Implementation.address);
    console.log('dollar', await rootAsD1.dollar());
    console.log('oracle', await rootAsD2.oracle());
    console.log('pool', await rootAsD3.pool());
    //console.log('oracle pair', await rootAsD3.pair());

}

module.exports = function (deployer) {
    deployer.then(async () => {
        console.log(deployer.network);
        switch (deployer.network) {
            case 'bsc':
                await deployTestnet(deployer);
                break;
            default:
            case 'dev':
                await deployTestnet(deployer);
                break;
        }
    })
};