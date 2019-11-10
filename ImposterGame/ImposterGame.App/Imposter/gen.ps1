$type = Read-Host 'Generate (p)age component, shared (c)omponent or (s)ervice'

If($type -eq 'c'){
    $componentName = Read-Host 'Name of shared component'

    ionic g component components/$componentName --spec false
}
ElseIf ($type -eq 'p'){
    $componentName = Read-Host 'Name of page'

    ionic g page pages/$componentName --spec false
}
ElseIf ($type -eq 's'){
    $serviceName = Read-Host 'Name of service'

    ionic g service services/$serviceName --spec false
}Else{
    Write-Host "Invalid choice."
}

Write-Host "Finished."