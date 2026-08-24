using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using UndertaleModLib.Models;
using UndertaleModLib.Util;

EnsureDataLoaded();

string snapshotPath = Environment.GetEnvironmentVariable("DEM_PRESTIGE_SNAPSHOT");
string outputDirectory = Environment.GetEnvironmentVariable("DEM_PRESTIGE_ICON_OUTPUT");
string reportPath = Environment.GetEnvironmentVariable("DEM_PRESTIGE_ICON_REPORT");
if (string.IsNullOrWhiteSpace(snapshotPath) || !File.Exists(snapshotPath))
{
    ScriptError("DEM_PRESTIGE_SNAPSHOT must name the source-controlled Prestige snapshot.");
    return;
}
if (string.IsNullOrWhiteSpace(outputDirectory) || !Directory.Exists(outputDirectory))
{
    ScriptError("DEM_PRESTIGE_ICON_OUTPUT must name an existing ignored output directory.");
    return;
}
if (string.IsNullOrWhiteSpace(reportPath))
{
    ScriptError("DEM_PRESTIGE_ICON_REPORT must name the local report file.");
    return;
}

JsonDocument snapshot = JsonDocument.Parse(File.ReadAllText(snapshotPath));
var selections = new List<(string Id, int SpriteIndex, UndertaleSprite Sprite)>();
var ids = new HashSet<string>(StringComparer.Ordinal);
foreach (JsonElement node in snapshot.RootElement.GetProperty("nodes").EnumerateArray())
{
    string id = node.GetProperty("id").GetString();
    int spriteIndex = node.GetProperty("internal").GetProperty("spriteResourceIndex").GetInt32();
    if (string.IsNullOrWhiteSpace(id) || !Regex.IsMatch(id, "^[A-Za-z0-9_]+$") || !ids.Add(id))
    {
        ScriptError($"Unsafe or duplicate Prestige upgrade ID: {id}");
        return;
    }
    if (spriteIndex < 0 || spriteIndex >= Data.Sprites.Count)
    {
        ScriptError($"Sprite index {spriteIndex} for {id} is outside the installed data file.");
        return;
    }

    UndertaleSprite sprite = Data.Sprites[spriteIndex];
    if (sprite is not { SSpriteType: UndertaleSprite.SpriteType.Normal, Textures.Count: > 0 }
        || sprite.Textures[0]?.Texture is null)
    {
        ScriptError($"Prestige sprite {spriteIndex} for {id} has no exportable first texture frame.");
        return;
    }
    selections.Add((id, spriteIndex, sprite));
}

if (selections.Count != 102)
{
    ScriptError($"Expected 102 Prestige nodes, found {selections.Count}.");
    return;
}

using (TextureWorker textureWorker = new TextureWorker())
{
    foreach (var selection in selections)
    {
        string outputPath = Path.Combine(outputDirectory, selection.Id + ".png");
        textureWorker.ExportAsPNG(selection.Sprite.Textures[0].Texture, outputPath, null, true);
    }
}

var report = new
{
    formatVersion = 1,
    sourceFile = FilePath,
    snapshotPath,
    exportedAtUtc = DateTime.UtcNow.ToString("O"),
    exportedNodeCount = selections.Count,
    uniqueSpriteResourceCount = selections.Select(selection => selection.SpriteIndex).Distinct().Count(),
    firstFrameOnly = true,
    paddedToSpriteCanvas = true,
    nodes = selections.Select(selection => new
    {
        id = selection.Id,
        spriteResourceIndex = selection.SpriteIndex,
        spriteResourceName = selection.Sprite.Name?.Content,
        availableFrames = selection.Sprite.Textures.Count,
        width = selection.Sprite.Width,
        height = selection.Sprite.Height,
        outputFile = selection.Id + ".png"
    })
};
File.WriteAllText(reportPath, JsonSerializer.Serialize(report, new JsonSerializerOptions { WriteIndented = true }));
ScriptMessage($"Exported {selections.Count} local Prestige icon PNGs from {report.uniqueSpriteResourceCount} sprite resources.");
