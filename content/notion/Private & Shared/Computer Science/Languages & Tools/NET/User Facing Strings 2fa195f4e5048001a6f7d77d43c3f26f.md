# User Facing Strings

https://learn.microsoft.com/en-us/dotnet/core/extensions/localization

## Must install

```
Microsoft.Extensions.Localization
```

## Resource File

Naming convention: **`<FullTypeName><.Locale>.resx`**

## Register Localisation

```csharp
HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

builder.Services.AddLocalization(options =>
{
    options.ResourcesPath = "Resources"; // aka file name
});
```

## DI

`IStringLocalizer<T>`

Use this if the resource will only be used in this class.

Since resource file will be named `MessageService.resx`

*NOTE: that you can use a `IStringLocalizer<ShairedResource>` class instead of `IStringLocalizer<MessageService>` the `T` is just a way of specifying the name and linking it to some class*

```csharp
using System.Diagnostics.CodeAnalysis;
using Microsoft.Extensions.Localization;

namespace Localization.Example;

public sealed class MessageService(IStringLocalizer<MessageService> localizer)
{
    [return: NotNullIfNotNull(nameof(localizer))]
    public string? GetGreetingMessage()
    {
        LocalizedString localizedString = localizer["GreetingMessage"];

        return localizedString;
    }
}
```

`IStringLocalizerFactory`

Use this if resource will be used across multiple classes.

Since resource file will be named `Strings.resx`

```csharp
using System.Diagnostics.CodeAnalysis;
using Microsoft.Extensions.Localization;

namespace Localization.Example;

public class ParameterizedMessageService(IStringLocalizerFactory factory)
{
    private readonly IStringLocalizer _localizer =
        factory.Create("Strings");

    [return: NotNullIfNotNull(nameof(_localizer))]
    public string? GetFormattedMessage(DateTime dateTime, double dinnerPrice)
    {
        LocalizedString localizedString = _localizer["DinnerPriceFormat", dateTime, dinnerPrice];

        return localizedString;
    }
}
```

Consider formatting too…

```java
// Strings.resx contains: ItemsCount = "You have {0} items."
var text = string.Format(CultureInfo.CurrentUICulture, Strings.ItemsCount, count);
```

## `.resx` Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<root>
  <data name="GreetingMessage" xml:space="preserve">
    <value>Hi friends, the ".NET" developer community is excited to see you here!</value>
  </data>
</root>
```