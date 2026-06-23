const HTMLRecoveryEmail = (code) => {
  return `
    <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #ffffff; color: #222; text-align: center; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 500px; margin: 0 auto;">
      
      
      <img src="" alt="Luckyshop" style="width: 160px; margin-bottom: 10px;">
      
      <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
      
      <!-- Titulo -->
      <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 15px;">Recuperación de contraseña</h2>
      
      <!-- Texto principal -->
      <p style="font-size: 14px; line-height: 1.6; color: #333;">
        Hola, hemos recibido una solicitud para restablecer tu contraseña.<br>
        Utiliza el siguiente código de verificación que aparece a continuación para continuar:
      </p>
      
      <!-- Código -->
      <div style="display: inline-block; background-color: #f0f0f0; color: #333; font-weight: 600; font-size: 18px; padding: 10px 25px; border-radius: 6px; margin: 20px 0;">
        ${code}
      </div>
      
      <!-- Nota -->
      <p style="font-size: 13px; color: #555;">
        Este código es válido durante los próximos <strong>15 minutos</strong>.
      </p>
      
    </div>
  `;
};

export default HTMLRecoveryEmail;