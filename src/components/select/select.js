import NativeSelect from '@material-ui/core/NativeSelect';
import React, { memo } from 'react';
import { withStyles } from '@material-ui/core/styles';

const NativeSelectStyled = withStyles({
  select: {
    fontSize: '0.875rem',
    fontWeight: '400',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    paddingBottom: '3px',
  },
})(NativeSelect);

const Select = memo((props) => {
  const { isPlanned, setIsPlanned, year } = props;

  const currentYear = new Date().getFullYear();

  return (
    <>
      {year === currentYear
        ? (
          <div>
            <NativeSelectStyled
              value={isPlanned ? 'Запланировано' : 'Выполнено'}
              onChange={() => {
                setIsPlanned(!isPlanned)
              }}
              name="name"
            >
              <option value="Выполнено">Выполнено</option>
              <option value="Запланировано">Запланировано</option>
            </NativeSelectStyled>
          </div>
        )
        : (
          <div>
            { year < currentYear ? 'Выполнено' : 'Запланировано'}
          </div>
        )}
    </>
  )
})

export default Select;
