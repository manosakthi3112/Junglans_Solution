$files = Get-ChildItem -Path "src" -Recurse -Include *.js, *.jsx
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    $ob = ($c.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $cb = ($c.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    $op = ($c.ToCharArray() | Where-Object { $_ -eq '(' }).Count
    $cp = ($c.ToCharArray() | Where-Object { $_ -eq ')' }).Count
    $ok = ($c.ToCharArray() | Where-Object { $_ -eq '[' }).Count
    $ck = ($c.ToCharArray() | Where-Object { $_ -eq ']' }).Count
    if ($ob -ne $cb -or $op -ne $cp -or $ok -ne $ck) {
        Write-Host "Mismatch in $($f.Name): Braces: $ob/$cb, Parens: $op/$cp, Brackets: $ok/$ck"
    } else {
        Write-Host "OK: $($f.Name)"
    }
}
