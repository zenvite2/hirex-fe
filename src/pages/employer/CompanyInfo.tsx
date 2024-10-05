import React from 'react';

const CompanyInfoForm = () => {
  return (
    <div style={{maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
      <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>Cập nhật thông tin công ty</h1>
      
      <form>
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>
            Tên công ty <span style={{color: 'red'}}>*</span>
          </label>
          <input type="text" placeholder="Pasal" style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>
            Trụ sở chính <span style={{color: 'red'}}>*</span>
          </label>
          <input type="text" placeholder="Số 206 Bạch Mai, Hai Bà Trưng, Hà Nội" style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
        </div>
        
        <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              Số điện thoại Cty <span style={{color: 'red'}}>*</span>
            </label>
            <input type="tel" placeholder="02436248686" style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px'}}>
              Email cty <span style={{color: 'red'}}>*</span>
            </label>
            <input type="email" placeholder="pasal@gmail.com" style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Ngành nghề</label>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
              {['Bán hàng', 'Marketing', 'Hành chính văn phòng', 'Kỹ thuật'].map((item) => (
                <label key={item} style={{display: 'flex', alignItems: 'center'}}>
                  <input type="checkbox" style={{marginRight: '5px'}} />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Quy mô công ty</label>
            <select style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
              <option>Dưới 10 người</option>
            </select>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Website</label>
            <input type="url" style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}} />
          </div>
          <div style={{flex: 1}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Thời gian làm việc</label>
            <select style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
              <option>Thứ 2 - đến thứ 6</option>
            </select>
          </div>
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Logo</label>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <button type="button" style={{padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f0f0f0'}}>Chọn tệp</button>
            <span style={{fontSize: '14px', color: '#666'}}>Không có tệp nào được chọn</span>
          </div>
          <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
            2023-04-16_179858503-1687873248089029-921053189088437070-n.jpg
          </div>
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Mô tả</label>
          <textarea rows={4} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}></textarea>
        </div>
        
        <div style={{textAlign: 'right'}}>
          <button type="submit" style={{padding: '10px 20px', backgroundColor: '#e91e63', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
            Cập nhật thông tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoForm;