# AzukiClusterScript

# 導入方法
## UnityPackageManager(UPM)
* Unityで[ウィンドウ]>[パッケージマネージャ-]を開き「+」>「GIT URLからパッケージを加える」から`https://github.com/sato-toma/ClusterScript.git`を指定する
  * 【未対応】UnityのパッケージにAzukiClusterScriptCustomPackageが登録できる
## 初期化
* [node.js](https://nodejs.org/en/download)をインストールする
* [Visual Studio Code](https://code.visualstudio.com/download)をインストールする
* リポジトリをクローンして、`Editor`フォルダで`npm install`を実行する
  * `Editor`フォルダにnode_modulesフォルダが生成される
## 型定義ファイルの更新 
* [型定義ファイル](https://docs.cluster.mu/script/#%E5%9E%8B%E5%AE%9A%E7%BE%A9%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB)をダウンロードし、`Editor\node_modules\@clustervr\cluster-script-types`にある`index.d.ts`をダウンロードしたファイルで上書きする
  * 入力補完が最新になる

# リポジトリの方針
## バージョニング
* `package.json`のversionの更新
  * Major:破壊的変更
    * フォルダー階層変更
    * ファイル名変更
  * Minor:機能の追加
    * 例：JSファイルを追加
  * Patch:不具合修正やリファクタリング
    * 変数名を変更
## フォルダ構成の方針
* beta機能はそのAPI単位でフォルダを分ける
  * 複数のbeta機能APIを使う場合、新しく使うAPIでフォルダを用意する
* 正式機能は機能の複雑度でフォルダを分ける
  * 単一機能をもつアイテムはSimpleItemで実装する
  * 機能を組み合わせたアイテムはComplexItemで実装する
  * アイテムを複数組み合わせた機能はCombinationItemsで実装する
* ```
   - Script/
     - _Beta/
      - CombinationItems/
        - Art/
        - Game/
        - Social/
      - ComplexItem/
      - SimpleItem/
        - Accessory/
        - CraftItem/
        - ExternalConnection/
        - Gift/
        - Player/
        - Sound/
  ```
## スクリプトの方針
* できるだけそのまま利用できるようにする
  * jsファイルだけでなく、それを使うためのprehubやマテリアルも配置する
    * mp3
      * できるだけ配置しない。利用したデータの元となるリンクを配置する
    * png
      * できるだけ配置しない。利用したデータの元となるリンクを配置する
  * 末端のフォルダにReadMe.mdとLICENSE.mdを配置する。
    * Readme.mdには使い方や用途、実装する元となる記事を記入する
    * LICENSE.mdには再配布や商用利用、コピーライトを記入する

