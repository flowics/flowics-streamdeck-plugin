# flowics-streamdeck-plugin

An Elgato Stream Deck plugin for controlling Flowics Graphics outputs.

## Development

Symlink (or copy) the `com.flowics.graphics.sdPlugin` folder to your [Stream Deck plugin folder](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/#creating-your-plugin)

```
ln -s `pwd`/com.flowics.graphics.sdPlugin /path/to/streamdeck/plugins/
```

## Packaging

https://developer.elgato.com/documentation/stream-deck/sdk/packaging/

### Creating a .streamDeckPlugin file

Here is how you can use the `DistributionTool` to export the `com.flowics.graphics.sdPlugin` plugin:

#### macOS

```
DistributionTool -b -i com.flowics.graphics.sdPlugin -o ~/Desktop/
```

#### Windows

```
DistributionTool.exe -b -i com.flowics.graphics.sdPlugin -o Release
```
