using System;
using System.IO;
using System.Linq;
using System.Text.Json;

EnsureDataLoaded();

string outputPath = Environment.GetEnvironmentVariable("DEM_METADATA_OUTPUT");
if (string.IsNullOrWhiteSpace(outputPath))
{
    ScriptError("DEM_METADATA_OUTPUT must name the JSON file to create.");
    return;
}

string outputDirectory = Path.GetDirectoryName(outputPath);
if (string.IsNullOrWhiteSpace(outputDirectory) || !Directory.Exists(outputDirectory))
{
    ScriptError("DEM_METADATA_OUTPUT must be inside an existing directory.");
    return;
}

var snapshot = new
{
    formatVersion = 1,
    sourceFile = FilePath,
    projectName = Data.GeneralInfo?.Name?.Content,
    displayName = Data.GeneralInfo?.DisplayName?.Content,
    isYyc = Data.IsYYC(),
    bytecodeVersion = Data.GeneralInfo?.BytecodeVersion,
    counts = new
    {
        strings = Data.Strings.Count,
        scripts = Data.Scripts.Count,
        objects = Data.GameObjects.Count,
        sprites = Data.Sprites.Count,
        rooms = Data.Rooms.Count
    },
    scripts = Data.Scripts.Select((script, index) => new
    {
        index,
        name = script.Name?.Content
    }),
    objects = Data.GameObjects.Select((gameObject, index) => new
    {
        index,
        name = gameObject.Name?.Content,
        sprite = gameObject.Sprite?.Name?.Content,
        visible = gameObject.Visible,
        solid = gameObject.Solid,
        persistent = gameObject.Persistent
    }),
    sprites = Data.Sprites.Select((sprite, index) => new
    {
        index,
        name = sprite.Name?.Content,
        width = sprite.Width,
        height = sprite.Height,
        originX = sprite.OriginX,
        originY = sprite.OriginY
    }),
    strings = Data.Strings.Select((value, index) => new
    {
        index,
        value = value.Content
    })
};

var options = new JsonSerializerOptions
{
    WriteIndented = true
};

File.WriteAllText(outputPath, JsonSerializer.Serialize(snapshot, options));
ScriptMessage($"Wrote read-only resource metadata to {outputPath}");
