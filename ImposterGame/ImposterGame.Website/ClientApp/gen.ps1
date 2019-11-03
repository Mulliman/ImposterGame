$type = Read-Host 'Generate (p)age component, shared (c)omponent or (s)ervice'

If($type -eq 'c'){
    $componentName = Read-Host 'Name of shared component'

    ng g c components/shared/$componentName  --module app
}
ElseIf ($type -eq 'p'){
    $componentName = Read-Host 'Name of page component'

    ng g c components/pages/$componentName  --module app
}
ElseIf ($type -eq 's'){
    $serviceName = Read-Host 'Name of service'

    ng g service services/$serviceName
}Else{
    Write-Host "Invalid choice."
}

Write-Host "Finished."