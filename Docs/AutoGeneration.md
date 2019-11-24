How to Auto Generate API clients in Angular
===========================================

Install Swagger Documentation using Swashbuckle
-----------------------------------------------

<PackageReference Include="Swashbuckle.AspNetCore" Version="5.0.0-rc4" />
<PackageReference Include="Swashbuckle.AspNetCore.SwaggerGen" Version="5.0.0-rc4" />
<PackageReference Include="Swashbuckle.AspNetCore.SwaggerUI" Version="5.0.0-rc4" />

Install dotnet tool to generate the swagger json file on disk
-------------------------------------------------------------

dotnet add package --version 5.0.0-rc4 Swashbuckle.AspNetCore

Add the following to your project file:

<Target Name="SwaggerToFile" AfterTargets="AfterBuild">
    <Exec Command="dotnet swagger tofile  --serializeasv2 --output ../api-contract.json $(OutputPath)$(AssemblyName).dll v1" />
</Target>

Ensure that required files and folders exist
--------------------------------------------

The folder in which you want the generated code to be placed must exist.

Also create an ng-config.json file that contains the settings you want to use.
For example:

```
{
    "npmName":"my-swagger-package",
    "npmVersion":"0.0.1",
    "ngVersion":"8"
}
```

Install and configure code generator
------------------------------------

npm install

npm i swagger-nodegen-cli

Create a new powershell script called api-generate-angular-clients.ps1
Populate the variables with your values.

```
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
```

Run the code generator on API build
-----------------------------------

<Target Name="SwaggerToFile" AfterTargets="AfterBuild">
    <Exec Command="dotnet swagger tofile  --serializeasv2 --output ../api-contract.json $(OutputPath)$(AssemblyName).dll v1" />
    <Exec Command="powershell.exe -NonInteractive -executionpolicy Unrestricted -command &quot;..\api-generate-angular-clients.ps1&quot;" />
</Target>

Use the generated code in Angular
---------------------------------

Add HttpClientModule to the imports in app.module.ts

Add the following to providers in app.module.ts:
```{ provide: BASE_PATH, useValue: "http://api.imposter.local" }```

Add each API you want to use in providers in app.module.ts too.
```
// APIs
ExampleApiService,
AnotherApiService
```