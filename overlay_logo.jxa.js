ObjC.import("Cocoa");
ObjC.import("Foundation");

function unwrap(value) {
  return ObjC.unwrap(value);
}

function pathJoin(left, right) {
  return unwrap($(left).stringByAppendingPathComponent($(right)));
}

function lastPathComponent(path) {
  return unwrap($(path).lastPathComponent);
}

function deletingPathExtension(path) {
  return unwrap($(path).stringByDeletingPathExtension);
}

function lowercaseExtension(path) {
  return unwrap($(path).pathExtension).toLowerCase();
}

function imageFromPath(path) {
  var image = $.NSImage.alloc.initWithContentsOfFile($(path));
  if (!image || image.isNil()) {
    throw new Error("Cannot open image: " + path);
  }
  return image;
}

function savePng(image, outputPath) {
  var tiff = image.TIFFRepresentation;
  var bitmap = $.NSBitmapImageRep.imageRepWithData(tiff);
  var data = bitmap.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $({}));
  data.writeToFileAtomically($(outputPath), true);
}

function overlayLogo(basePath, logoImage, outputPath) {
  var baseImage = imageFromPath(basePath);
  var size = baseImage.size;
  var canvasSize = $.NSMakeSize(size.width, size.height);
  var canvas = $.NSImage.alloc.initWithSize(canvasSize);

  canvas.lockFocus;
  baseImage.drawInRectFromRectOperationFraction(
    $.NSMakeRect(0, 0, size.width, size.height),
    $.NSZeroRect,
    $.NSCompositingOperationSourceOver,
    1.0
  );
  logoImage.drawInRectFromRectOperationFraction(
    $.NSMakeRect(0, 0, size.width, size.height),
    $.NSZeroRect,
    $.NSCompositingOperationSourceOver,
    1.0
  );
  canvas.unlockFocus;

  savePng(canvas, outputPath);
}

function main(argv) {
  if (argv.length < 3) {
    throw new Error("Usage: overlay_logo.jxa.js INPUT_IMAGE OUTPUT_IMAGE LOGO_FILE");
  }

  var inputPath = argv[0];
  var outputPath = argv[1];
  var logoPath = argv[2];

  var logoImage = imageFromPath(logoPath);
  overlayLogo(inputPath, logoImage, outputPath);
  return outputPath;
}

function run(argv) {
  return main(argv);
}
