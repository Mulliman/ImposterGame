$scriptpath = $MyInvocation.MyCommand.Path;
$dir = Split-Path $scriptpath;

Push-Location $dir

$generatorDir = resolve-path ".\ImposterGame.Website";
$outputDir = resolve-path ".\ImposterGame.App\Imposter\src\server";
$apiContractJsonFile = resolve-path ".\api-contract.json";
$ngConfigJsonFile = resolve-path ".\ImposterGame.App\Imposter\src\codegen\ng-config.json";

Push-Location $generatorDir

& swagger-nodegen-cli generate -i $apiContractJsonFile -l typescript-angular -o $outputDir -c $ngConfigJsonFile

Pop-Location
Pop-Location