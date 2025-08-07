const getImageThumb = (file: string, size: 'lg'|'md'|'sm'|'xs'|'xxs') => {
  let modifiedSize = ''
  let modifiedFile = []
  switch (size) {
    case 'lg':
      modifiedSize = 'large';
      break;
    case 'md':
      modifiedSize = 'medium';
      break;
    case 'sm':
      modifiedSize = 'small';
      break;
    case 'xs':
      modifiedSize = 'xsmall';
      break;
    case 'xxs':
      modifiedSize = 'xxsmall';
      break;
  }

  modifiedFile = file.split('/');
  const indexEnd = modifiedFile.length - 1;
  modifiedFile[indexEnd] = modifiedSize + '-' + modifiedFile[indexEnd];
  let thumb = '';
  for (let i = 0; i < modifiedFile.length; i++) {
    thumb += modifiedFile[i] + (indexEnd === i ? '' : '/');
  }

  return thumb;
};

export default getImageThumb;
