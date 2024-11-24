read -p "keystore path: " keystore_path
read -p "password: " password
read -p "alias: " alias

npx cap build android --keystorepath $keystore_path --keystorepass \
    $password --keystorealias $alias --keystorealiaspass $password
